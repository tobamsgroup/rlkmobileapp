# TTS & Reading Settings — Frontend Integration Guide


---

## Overview

The flow for TTS on the frontend:

1. Kid picks a voice → `PATCH /kid/me/reading-settings`
2. Kid opens a chapter page → `GET /tts/:chapterId/audio?page=0`
3. Frontend plays the returned `audioUrl` (MP3 hosted on Cloudinary)
4. Kid finishes a page → `PATCH /kid/reading-progress/update`

---

## Endpoints

### 1. List supported voices (our curated list)

Returns all voice IDs the app supports. Use these IDs everywhere.

```
GET /tts/voices
```

**Sample response**
```json
{
  "statusCode": 200,
  "message": "Voices fetched successfully",
  "data": [
    {
      "id": "adult-female-us",
      "languageCodes": ["en-US"],
      "name": "en-US-Chirp3-HD-Gacrux",
      "ssmlGender": "FEMALE"
    },
    {
      "id": "adult-male-us",
      "languageCodes": ["en-US"],
      "name": "en-US-Chirp3-HD-Algenib",
      "ssmlGender": "MALE"
    }
  ]
}
```

> The full list of 16 voices follows the pattern `{adult|young}-{female|male}-{us|uk|au|in}`.

**Axios**
```js
const { data } = await axios.get(`${BASE_URL}/tts/voices`, {
  headers: { Authorization: `Bearer ${token}` },
});
const voices = data.data; // array of voice objects
```

---

### 2. Update kid's reading settings (save preferred voice)

The kid selects a voice once; it is persisted and used automatically on every TTS request.

```
PATCH /kid/me/reading-settings
Content-Type: application/json
```

**Body**
```json
{
  "voice": "adult-female-us"
}
```

Valid values for `voice`: any ID from the voices list above (e.g. `young-male-uk`, `adult-female-au`).

**Sample response**
```json
{
  "statusCode": 200,
  "message": "Reading settings updated successfully",
  "data": {
    "_id": "664a1f2e8c4b2a001e3d9abc",
    "username": "timmy123",
    "readingSettings": {
      "voice": "adult-female-us"
    }
  }
}
```

**Axios**
```js
await axios.patch(
  `${BASE_URL}/kid/me/reading-settings`,
  { voice: 'adult-female-us' },
  { headers: { Authorization: `Bearer ${token}` } },
);
```

---

### 3. Get (or generate) audio for a chapter page

Fetches a cached audio URL for the page. If no audio exists yet for this page + voice combination, it is generated on the fly, uploaded to Cloudinary, and the URL is returned. Subsequent calls for the same page return instantly from cache.

```
GET /tts/:chapterId/audio?page=:pageIndex
```

| Param | Type | Description |
|---|---|---|
| `chapterId` | path | MongoDB ObjectId of the chapter |
| `page` | query | Zero-based page index |

**Sample request**
```
GET /tts/664a1f2e8c4b2a001e3d9001/audio?page=0
```

**Sample response**
```json
{
  "statusCode": 200,
  "message": "Audio fetched successfully",
  "data": {
    "audioUrl": "https://res.cloudinary.com/yourcloud/video/upload/tts/664a1f2e8c4b2a001e3d9001/0-adult-female-us.mp3"
  }
}
```

**Axios + play audio**
```js
const { data } = await axios.get(
  `${BASE_URL}/tts/${chapterId}/audio`,
  {
    params: { page: pageIndex },
    headers: { Authorization: `Bearer ${token}` },
  },
);

const audio = new Audio(data.data.audioUrl);
audio.play();
```

> **Performance tip:** Pre-fetch the next page's audio while the kid is listening to the current one.

```js
// Pre-fetch next page in background (fire and forget)
axios.get(`${BASE_URL}/tts/${chapterId}/audio`, {
  params: { page: pageIndex + 1 },
  headers: { Authorization: `Bearer ${token}` },
});
```

---

### 4. Update reading progress (page completed)

Call this when the kid finishes reading a page and taps "next". This also triggers automatic badge assignment when the first or last chapter of a series is completed.

```
PATCH /kid/reading-progress/update
Content-Type: application/json
```

**Body**
```json
{
  "chapterId": "664a1f2e8c4b2a001e3d9001",
  "newPageIndex": "1"
}
```

> `newPageIndex` is the index of the page just completed (string, the server parses it).

**Sample response**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "_id": "664a1f2e8c4b2a001e3d9abc",
    "assignedChapters": [
      {
        "chapterId": "664a1f2e8c4b2a001e3d9001",
        "currentPageIndex": 1,
        "completed": false
      }
    ]
  }
}
```

**Axios**
```js
await axios.patch(
  `${BASE_URL}/kid/reading-progress/update`,
  { chapterId, newPageIndex: String(pageIndex) },
  { headers: { Authorization: `Bearer ${token}` } },
);
```

---

## Full Page-Reading Flow (Axios)

```js
async function readChapterPage(token, chapterId, pageIndex) {
  // 1. Get audio for current page
  const { data: audioRes } = await axios.get(
    `${BASE_URL}/tts/${chapterId}/audio`,
    {
      params: { page: pageIndex },
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  // 2. Play audio
  const audio = new Audio(audioRes.data.audioUrl);
  audio.play();

  // 3. Pre-fetch next page audio in background
  axios.get(`${BASE_URL}/tts/${chapterId}/audio`, {
    params: { page: pageIndex + 1 },
    headers: { Authorization: `Bearer ${token}` },
  });

  // 4. When kid taps "next" / audio ends — mark progress
  audio.addEventListener('ended', async () => {
    await axios.patch(
      `${BASE_URL}/kid/reading-progress/update`,
      { chapterId, newPageIndex: String(pageIndex) },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  });
}
```

---

## Voice Picker Flow (Axios)

```js
// 1. Load available voices for the picker UI
async function loadVoices(token) {
  const { data } = await axios.get(`${BASE_URL}/tts/voices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data; // [{ id, languageCodes, name, ssmlGender }, ...]
}

// 2. Save selection
async function saveVoice(token, voiceId) {
  await axios.patch(
    `${BASE_URL}/kid/me/reading-settings`,
    { voice: voiceId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}
```

---

## Error Responses

| Status | Meaning |
|---|---|
| `400` | Missing or invalid query param (e.g. `page` not a number, invalid `voice` ID) |
| `401` | Missing or expired JWT |
| `403` | JWT belongs to a non-Kid role |
| `404` | Chapter or page not found |
| `500` | Google TTS returned no audio (upstream error) |

```json
{
  "statusCode": 404,
  "message": "Page with index 99 not found",
  "error": "Not Found"
}
```

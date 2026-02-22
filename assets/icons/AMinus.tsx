




import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="48" height="35" viewBox="0 0 48 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_5484_48658)">
<path d="M0 16C0 7.16344 7.16344 0 16 0L32 0C40.8366 0 48 7.16344 48 16C48 24.8366 40.8366 32 32 32H16C7.16344 32 0 24.8366 0 16Z" fill="#099137" fill-opacity="0.1" shape-rendering="crispEdges"/>
<path d="M8 12C8 5.37258 13.3726 0 20 0L28 0C34.6274 0 40 5.37258 40 12V20C40 26.6274 34.6274 32 28 32H20C13.3726 32 8 26.6274 8 20V12Z" fill="url(#paint0_linear_5484_48658)" fill-opacity="0.08"/>
<path d="M16 23V12.5C16 11.5717 16.3687 10.6815 17.0251 10.0251C17.6815 9.36875 18.5717 9 19.5 9C20.4283 9 21.3185 9.36875 21.9749 10.0251C22.6313 10.6815 23 11.5717 23 12.5V23M16 17H23M33 16H27" stroke="#3F9243" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_5484_48658" x="0" y="0" width="48" height="35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.247059 0 0 0 0 0.572549 0 0 0 0 0.262745 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5484_48658"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5484_48658" result="shape"/>
</filter>
<linearGradient id="paint0_linear_5484_48658" x1="24.1798" y1="-1.83726e-06" x2="24.1798" y2="32" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

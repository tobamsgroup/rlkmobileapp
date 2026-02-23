


import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="48" height="43" viewBox="0 0 48 43" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_4720_69250)">
<path d="M0 20C0 8.95431 8.9543 0 20 0L28 0C39.0457 0 48 8.95431 48 20C48 31.0457 39.0457 40 28 40H20C8.95431 40 0 31.0457 0 20Z" fill="url(#paint0_linear_4720_69250)"/>
<path d="M8 16C8 9.37258 13.3726 4 20 4H28C34.6274 4 40 9.37258 40 16V24C40 30.6274 34.6274 36 28 36H20C13.3726 36 8 30.6274 8 24V16Z" fill="url(#paint1_linear_4720_69250)" fill-opacity="0.08"/>
<path d="M20 13V27M28 13V27" stroke="#D5B300" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_4720_69250" x="0" y="0" width="48" height="43" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.835294 0 0 0 0 0.701961 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4720_69250"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4720_69250" result="shape"/>
</filter>
<linearGradient id="paint0_linear_4720_69250" x1="24" y1="0" x2="24" y2="40" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFF7CC"/>
<stop offset="1" stop-color="#FFEB80"/>
</linearGradient>
<linearGradient id="paint1_linear_4720_69250" x1="24.1798" y1="4" x2="24.1798" y2="36" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

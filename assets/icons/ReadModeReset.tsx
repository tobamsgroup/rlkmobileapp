import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="64" height="51" viewBox="0 0 64 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_6262_27501)">
<path d="M0 24C0 10.7452 10.7452 0 24 0L40 0C53.2548 0 64 10.7452 64 24C64 37.2548 53.2548 48 40 48L24 48C10.7452 48 0 37.2548 0 24Z" fill="#099137" fill-opacity="0.1" shape-rendering="crispEdges"/>
<path d="M8 16C8 9.37258 13.3726 4 20 4L44 4C50.6274 4 56 9.37258 56 16V32C56 38.6274 50.6274 44 44 44H20C13.3726 44 8 38.6274 8 32V16Z" fill="url(#paint0_linear_6262_27501)" fill-opacity="0.08"/>
<path d="M42.5768 25.388C42.325 27.3079 41.5553 29.1231 40.3503 30.6389C39.1453 32.1546 37.5504 33.3138 35.7367 33.992C33.923 34.6702 31.9589 34.842 30.055 34.4887C28.1511 34.1355 26.3792 33.2707 24.9295 31.9871C23.4798 30.7034 22.4068 29.0493 21.8257 27.2022C21.2445 25.3551 21.1772 23.3846 21.6308 21.5021C22.0845 19.6196 23.042 17.8961 24.4007 16.5165C25.7594 15.1368 27.4681 14.153 29.3434 13.6706C34.5421 12.3373 39.9234 15.0133 41.9101 20M42.6661 13.3333V20H35.9994" stroke="#3F9243" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_6262_27501" x="0" y="0" width="64" height="51" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.247059 0 0 0 0 0.572549 0 0 0 0 0.262745 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6262_27501"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6262_27501" result="shape"/>
</filter>
<linearGradient id="paint0_linear_6262_27501" x1="32.2697" y1="4" x2="32.2697" y2="44" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

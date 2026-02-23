

import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="64" height="51" viewBox="0 0 64 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_6262_27512)">
<path d="M0 24C0 10.7452 10.7452 0 24 0L40 0C53.2548 0 64 10.7452 64 24C64 37.2548 53.2548 48 40 48L24 48C10.7452 48 0 37.2548 0 24Z" fill="#D3D2D3" fill-opacity="0.4" shape-rendering="crispEdges"/>
<path d="M8 16C8 9.37258 13.3726 4 20 4L44 4C50.6274 4 56 9.37258 56 16V32C56 38.6274 50.6274 44 44 44H20C13.3726 44 8 38.6274 8 32V16Z" fill="url(#paint0_linear_6262_27512)" fill-opacity="0.08"/>
<path d="M40 32L24 16M40 16L24 32" stroke="#221D23" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_6262_27512" x="0" y="0" width="64" height="51" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.423529 0 0 0 0 0.407843 0 0 0 0 0.423529 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6262_27512"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6262_27512" result="shape"/>
</filter>
<linearGradient id="paint0_linear_6262_27512" x1="32.2697" y1="4" x2="32.2697" y2="44" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

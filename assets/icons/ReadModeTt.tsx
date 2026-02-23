import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="48" height="43" viewBox="0 0 48 43" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_6234_3221)">
<g clip-path="url(#clip0_6234_3221)">
<path d="M0 20C0 8.95431 8.9543 0 20 0L28 0C39.0457 0 48 8.95431 48 20C48 31.0457 39.0457 40 28 40H20C8.95431 40 0 31.0457 0 20Z" fill="#D3D2D3" fill-opacity="0.4" shape-rendering="crispEdges"/>
<path d="M15 15V13H28V15M22 13V27M24 27H20M27 21V20H33V21M30 20V27M29 27H31" stroke="#221D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</g>
<defs>
<filter id="filter0_d_6234_3221" x="0" y="0" width="48" height="43" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.278431 0 0 0 0 0.262745 0 0 0 0 0.282353 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6234_3221"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6234_3221" result="shape"/>
</filter>
<clipPath id="clip0_6234_3221">
<path d="M0 20C0 8.95431 8.9543 0 20 0L28 0C39.0457 0 48 8.95431 48 20C48 31.0457 39.0457 40 28 40H20C8.95431 40 0 31.0457 0 20Z" fill="white"/>
</clipPath>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

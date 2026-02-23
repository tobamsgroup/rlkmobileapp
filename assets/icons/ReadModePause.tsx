



import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="64" height="51" viewBox="0 0 64 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_6262_27506)">
<path d="M0 24C0 10.7452 10.7452 0 24 0L40 0C53.2548 0 64 10.7452 64 24C64 37.2548 53.2548 48 40 48L24 48C10.7452 48 0 37.2548 0 24Z" fill="#DE2121" fill-opacity="0.1" shape-rendering="crispEdges"/>
<path d="M8 16C8 9.37258 13.3726 4 20 4L44 4C50.6274 4 56 9.37258 56 16V32C56 38.6274 50.6274 44 44 44H20C13.3726 44 8 38.6274 8 32V16Z" fill="url(#paint0_linear_6262_27506)" fill-opacity="0.08"/>
<path d="M42.666 30.6667V17.3334C42.666 16.2725 42.2446 15.2551 41.4944 14.5049C40.7443 13.7548 39.7269 13.3334 38.666 13.3334L25.3327 13.3334C24.2718 13.3334 23.2544 13.7548 22.5043 14.5049C21.7541 15.2551 21.3327 16.2725 21.3327 17.3334L21.3327 30.6667C21.3327 31.7276 21.7541 32.745 22.5043 33.4951C23.2544 34.2453 24.2718 34.6667 25.3327 34.6667H38.666C39.7269 34.6667 40.7443 34.2453 41.4944 33.4951C42.2446 32.745 42.666 31.7276 42.666 30.6667Z" fill="#DE2121"/>
</g>
<defs>
<filter id="filter0_d_6262_27506" x="0" y="0" width="64" height="51" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.870588 0 0 0 0 0.129412 0 0 0 0 0.129412 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6262_27506"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6262_27506" result="shape"/>
</filter>
<linearGradient id="paint0_linear_6262_27506" x1="32.2697" y1="4" x2="32.2697" y2="44" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};


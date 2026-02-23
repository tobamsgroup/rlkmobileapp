import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="64" height="51" viewBox="0 0 64 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_6262_27494)">
<path d="M0 24C0 10.7452 10.7452 0 24 0L40 0C53.2548 0 64 10.7452 64 24C64 37.2548 53.2548 48 40 48L24 48C10.7452 48 0 37.2548 0 24Z" fill="#D5B300"/>
<path d="M8 16C8 9.37258 13.3726 4 20 4L44 4C50.6274 4 56 9.37258 56 16V32C56 38.6274 50.6274 44 44 44H20C13.3726 44 8 38.6274 8 32V16Z" fill="url(#paint0_linear_6262_27494)" fill-opacity="0.08"/>
<path d="M36 18.6667C36.828 19.2877 37.5 20.0929 37.9628 21.0186C38.4257 21.9443 38.6667 22.9651 38.6667 24C38.6667 25.035 38.4257 26.0558 37.9628 26.9815C37.5 27.9072 36.828 28.7124 36 29.3334M39.6 14.6667C40.9919 15.7916 42.1147 17.2135 42.886 18.8285C43.6572 20.4434 44.0575 22.2104 44.0575 24C44.0575 25.7897 43.6572 27.5567 42.886 29.1716C42.1147 30.7865 40.9919 32.2085 39.6 33.3334M24 28H21.3333C20.9797 28 20.6406 27.8596 20.3905 27.6095C20.1405 27.3595 20 27.0203 20 26.6667V21.3334C20 20.9798 20.1405 20.6406 20.3905 20.3906C20.6406 20.1405 20.9797 20 21.3333 20H24L28.6667 14C28.7832 13.7737 28.9769 13.5965 29.2127 13.5004C29.4484 13.4044 29.7108 13.3959 29.9523 13.4764C30.1939 13.5569 30.3986 13.7211 30.5296 13.9394C30.6607 14.1577 30.7093 14.4157 30.6667 14.6667V33.3334C30.7093 33.5844 30.6607 33.8424 30.5296 34.0607C30.3986 34.279 30.1939 34.4432 29.9523 34.5237C29.7108 34.6042 29.4484 34.5957 29.2127 34.4997C28.9769 34.4036 28.7832 34.2264 28.6667 34L24 28Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_6262_27494" x="0" y="0" width="64" height="51" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.501961 0 0 0 0 0.423529 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6262_27494"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6262_27494" result="shape"/>
</filter>
<linearGradient id="paint0_linear_6262_27494" x1="32.2697" y1="4" x2="32.2697" y2="44" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

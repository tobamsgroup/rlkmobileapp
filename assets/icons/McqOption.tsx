import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="133" height="133" viewBox="0 0 133 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_6234_12260)">
<path d="M29.62 1.9139C15.6711 3.30879 6.29381 12.6385 1.90075 19.2533C0.570109 21.2569 0.756253 23.8361 2.18429 25.7715C4.62598 29.0807 8.73502 34.1441 12.7234 36.7414C21.7251 42.6035 29.62 42.6035 29.62 42.6035C47.8958 44.6724 82.0337 44.6724 117.896 42.6035C138.24 41.4297 133.988 2.60356 113.068 1.9139C92.1486 1.22425 46.1717 0.258735 29.62 1.9139Z" fill="#3F9243"/>
</g>
<path d="M29.62 1.9139C15.6711 3.30879 6.29381 12.6385 1.90075 19.2533C0.570109 21.2569 0.756253 23.8361 2.18429 25.7715C4.62598 29.0807 8.73502 34.1441 12.7234 36.7414C21.7251 42.6035 29.62 42.6035 29.62 42.6035C47.8958 44.6724 82.0337 44.6724 117.896 42.6035C138.24 41.4297 133.988 2.60356 113.068 1.9139C92.1486 1.22425 46.1717 0.258735 29.62 1.9139Z" stroke="#3F9243" stroke-width="2" stroke-linejoin="round"/>
<defs>
<filter id="filter0_i_6234_12260" x="0" y="0" width="132.143" height="47.9139" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2.75862"/>
<feGaussianBlur stdDeviation="6.89654"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.458824 0 0 0 0 0.207843 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_6234_12260"/>
</filter>
</defs>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

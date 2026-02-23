import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="48" height="43" viewBox="0 0 48 43" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_6234_3212)">
<path d="M0 20C0 8.95431 8.9543 0 20 0L28 0C39.0457 0 48 8.95431 48 20C48 31.0457 39.0457 40 28 40H20C8.95431 40 0 31.0457 0 20Z" fill="#221D23"/>
<path d="M8 16C8 9.37258 13.3726 4 20 4H28C34.6274 4 40 9.37258 40 16V24C40 30.6274 34.6274 36 28 36H20C13.3726 36 8 30.6274 8 24V16Z" fill="url(#paint0_linear_6234_3212)" fill-opacity="0.08"/>
<path d="M27 16.0002C27.621 16.4659 28.125 17.0699 28.4721 17.7641C28.8193 18.4584 29 19.224 29 20.0002C29 20.7764 28.8193 21.542 28.4721 22.2363C28.125 22.9306 27.621 23.5345 27 24.0002M29.7 13.0002C30.744 13.8439 31.586 14.9103 32.1645 16.1215C32.7429 17.3327 33.0431 18.658 33.0431 20.0002C33.0431 21.3425 32.7429 22.6677 32.1645 23.8789C31.586 25.0901 30.744 26.1566 29.7 27.0002M18 23.0002H16C15.7348 23.0002 15.4804 22.8949 15.2929 22.7073C15.1054 22.5198 15 22.2654 15 22.0002V18.0002C15 17.735 15.1054 17.4806 15.2929 17.2931C15.4804 17.1056 15.7348 17.0002 16 17.0002H18L21.5 12.5002C21.5874 12.3304 21.7326 12.1975 21.9095 12.1255C22.0863 12.0535 22.2831 12.0471 22.4643 12.1075C22.6454 12.1678 22.799 12.291 22.8972 12.4548C22.9955 12.6185 23.0319 12.812 23 13.0002V27.0002C23.0319 27.1885 22.9955 27.3819 22.8972 27.5457C22.799 27.7094 22.6454 27.8326 22.4643 27.893C22.2831 27.9534 22.0863 27.947 21.9095 27.8749C21.7326 27.8029 21.5874 27.67 21.5 27.5002L18 23.0002Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_6234_3212" x="0" y="0" width="48" height="43" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.423529 0 0 0 0 0.407843 0 0 0 0 0.423529 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6234_3212"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6234_3212" result="shape"/>
</filter>
<linearGradient id="paint0_linear_6234_3212" x1="24.1798" y1="4" x2="24.1798" y2="36" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};



import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="385" height="168" viewBox="0 0 385 168" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M220.356 23.4883C296.21 5.10034 318.789 49.1303 319.274 70.4431C425.459 83.4311 386.185 165.352 319.274 165.352C245.086 167.35 92.3458 170.148 74.8898 165.352C3.87772 177.829 -50.2063 80.4342 74.8898 47.4658C101.079 -10.4784 173.812 -11.4771 220.356 23.4883Z" fill="url(#paint0_linear_125_142)" fill-opacity="0.8"/>
<defs>
<linearGradient id="paint0_linear_125_142" x1="196.842" y1="-1.19297e-06" x2="136.856" y2="203.218" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.604"/>
<stop offset="1" stop-color="white" stop-opacity="0.2"/>
</linearGradient>
</defs>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

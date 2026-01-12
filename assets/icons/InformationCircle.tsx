

import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6663 8.00016C14.6663 4.31826 11.6815 1.3335 7.99967 1.3335C4.31777 1.3335 1.33301 4.31826 1.33301 8.00016C1.33301 11.682 4.31777 14.6668 7.99967 14.6668C11.6815 14.6668 14.6663 11.682 14.6663 8.00016Z" stroke="#DE2121"/>
<path d="M8.16178 11.3335V8.00016C8.16178 7.6859 8.16178 7.52876 8.06412 7.4311C7.96652 7.3335 7.80938 7.3335 7.49512 7.3335" stroke="#DE2121" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.99512 5.3335H8.00112" stroke="#DE2121" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="12" fill="#3F9243"/>
<path d="M13.9888 8.28325L14.8546 7.41746C15.3328 6.9393 16.1081 6.9393 16.5862 7.41746C17.0644 7.89562 17.0644 8.67088 16.5862 9.14904L15.7204 10.0148M13.9888 8.28325L8.90323 13.3689C8.2576 14.0145 7.93478 14.3373 7.71496 14.7307C7.49514 15.1241 7.27398 16.0529 7.0625 16.9412C7.95073 16.7297 8.87961 16.5085 9.27299 16.2887C9.66637 16.0689 9.98918 15.7461 10.6348 15.1005L15.7204 10.0148M13.9888 8.28325L15.7204 10.0148" stroke="white" stroke-width="1.07058" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.375 16.9414H15.0809" stroke="white" stroke-width="1.07058" stroke-linecap="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

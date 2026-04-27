import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {

  const strokeColor = props?.stroke || "#1671D9";
  const strokeWidth = props?.strokeWidth || "2.22222";
  const xml = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.60937 5.27799V8.61133M8.60937 11.9447H8.61771M1.10938 8.61133C1.10937 9.59624 1.30337 10.5715 1.68028 11.4815C2.05719 12.3914 2.60963 13.2182 3.30607 13.9146C4.00251 14.6111 4.82931 15.1635 5.73925 15.5404C6.64919 15.9173 7.62446 16.1113 8.60937 16.1113C9.59429 16.1113 10.5696 15.9173 11.4795 15.5404C12.3894 15.1635 13.2162 14.6111 13.9127 13.9146C14.6091 13.2182 15.1616 12.3914 15.5385 11.4815C15.9154 10.5715 16.1094 9.59624 16.1094 8.61133C16.1094 6.6222 15.3192 4.71455 13.9127 3.30803C12.5062 1.9015 10.5985 1.11133 8.60937 1.11133C6.62025 1.11133 4.7126 1.9015 3.30607 3.30803C1.89955 4.71455 1.10938 6.6222 1.10938 8.61133Z" stroke=${String(strokeColor)} stroke-width=${String(strokeWidth)} stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.6127 10.8684C16.4553 12.0683 15.9743 13.2028 15.2211 14.1502C14.468 15.0975 13.4712 15.822 12.3376 16.2459C11.2041 16.6698 9.97649 16.7771 8.78656 16.5564C7.59662 16.3356 6.48923 15.7951 5.58313 14.9928C4.67704 14.1905 4.00644 13.1567 3.64323 12.0022C3.28003 10.8478 3.23794 9.61625 3.52147 8.43969C3.805 7.26314 4.40345 6.18595 5.25265 5.32367C6.10185 4.46138 7.16976 3.84653 8.34184 3.54504C11.591 2.7117 14.9543 4.3842 16.196 7.50087M16.6685 3.33419V7.50086H12.5018" stroke="#474348" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

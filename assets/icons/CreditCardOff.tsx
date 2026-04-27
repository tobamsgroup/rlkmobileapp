import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 4L28 28M12 6.66667H24C25.0609 6.66667 26.0783 7.08809 26.8284 7.83824C27.5786 8.58839 28 9.6058 28 10.6667V21.3333C28.0004 21.7263 27.9429 22.1172 27.8293 22.4933M25.16 25.1627C24.7838 25.2762 24.3929 25.3337 24 25.3333H8C6.93913 25.3333 5.92172 24.9119 5.17157 24.1618C4.42143 23.4116 4 22.3942 4 21.3333V10.6667C4 8.864 5.192 7.34 6.832 6.84M4 14.6667H14.6667M20 14.6667H28M9.33333 20H9.34667M14.6667 20H17.3333" stroke="#918E91" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

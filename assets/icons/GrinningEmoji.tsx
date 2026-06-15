





import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30.3563 53.2125C42.9794 53.2125 53.2125 42.9794 53.2125 30.3563C53.2125 17.7331 42.9794 7.5 30.3563 7.5C17.7331 7.5 7.5 17.7331 7.5 30.3563C7.5 42.9794 17.7331 53.2125 30.3563 53.2125Z" fill="url(#paint0_radial_8284_585)"/>
<path opacity="0.5" d="M30.3563 53.2125C42.9794 53.2125 53.2125 42.9794 53.2125 30.3563C53.2125 17.7331 42.9794 7.5 30.3563 7.5C17.7331 7.5 7.5 17.7331 7.5 30.3563C7.5 42.9794 17.7331 53.2125 30.3563 53.2125Z" fill="url(#paint1_radial_8284_585)"/>
<path d="M25.331 18.5133C25.331 17.5991 24.3424 17.025 22.6415 17.025C21.1956 17.025 18.017 17.8223 15.8271 20.6395C15.4231 21.1604 16.0397 21.4474 16.4437 21.1073C17.7938 19.9591 21.3977 18.4921 24.2148 18.8003C25.3417 18.9279 25.331 18.5133 25.331 18.5133Z" fill="url(#paint2_linear_8284_585)"/>
<path d="M22.8959 29.6224C24.1112 29.6224 25.0965 28.1326 25.0965 26.295C25.0965 24.4573 24.1112 22.9675 22.8959 22.9675C21.6805 22.9675 20.6953 24.4573 20.6953 26.295C20.6953 28.1326 21.6805 29.6224 22.8959 29.6224Z" fill="url(#paint3_radial_8284_585)"/>
<path d="M22.8959 24.0845C23.842 24.0845 24.6606 24.903 25.0965 26.1256C25.0646 24.329 24.0972 22.8832 22.8959 22.8832C21.6946 22.8832 20.7272 24.329 20.6953 26.1256C21.1311 24.9137 21.9498 24.0845 22.8959 24.0845Z" fill="url(#paint4_linear_8284_585)"/>
<path d="M35.3867 18.5133C35.3867 17.5991 36.3754 17.025 38.0764 17.025C39.5221 17.025 42.7008 17.8223 44.8907 20.6395C45.2947 21.1604 44.6781 21.4474 44.2741 21.1073C42.924 19.9591 39.3202 18.4921 36.503 18.8003C35.3761 18.9279 35.3867 18.5133 35.3867 18.5133Z" fill="url(#paint5_linear_8284_585)"/>
<path d="M37.8217 29.6224C39.037 29.6224 40.0222 28.1326 40.0222 26.295C40.0222 24.4573 39.037 22.9675 37.8217 22.9675C36.6063 22.9675 35.6211 24.4573 35.6211 26.295C35.6211 28.1326 36.6063 29.6224 37.8217 29.6224Z" fill="url(#paint6_radial_8284_585)"/>
<path d="M37.8217 24.0845C36.8755 24.0845 36.0569 24.903 35.6211 26.1256C35.653 24.329 36.6204 22.8832 37.8217 22.8832C39.0229 22.8832 39.9903 24.329 40.0222 26.1256C39.5863 24.9137 38.7678 24.0845 37.8217 24.0845Z" fill="url(#paint7_linear_8284_585)"/>
<path d="M45.7967 34.2259C45.6266 34.1622 45.4352 34.1515 45.2651 34.2047C40.4388 35.5867 35.4316 36.2777 30.3714 36.2777C25.3111 36.2777 20.2933 35.5761 15.4776 34.2047C15.2969 34.1515 15.1162 34.1622 14.9461 34.2259C14.4252 34.4385 13.596 35.2252 14.6909 38.2338V38.2444C16.3068 42.0928 20.591 48.8539 30.3607 48.8539C40.1092 48.8539 44.3934 42.0821 46.0519 38.2444C47.1361 35.2252 46.3176 34.4385 45.7967 34.2259Z" fill="url(#paint8_radial_8284_585)"/>
<path d="M30.358 47.7802C34.4083 47.7802 37.4487 46.5364 39.7237 44.8354C37.2255 43.7086 34.1425 42.975 30.358 42.975C26.5734 42.975 23.4904 43.7191 20.9922 44.8567C23.2672 46.5364 26.3077 47.7802 30.358 47.7802Z" fill="url(#paint9_radial_8284_585)"/>
<path d="M45.4813 34.1625C45.4494 34.1625 45.4175 34.1625 45.375 34.1731C40.5061 35.5764 35.4565 36.2887 30.343 36.2887C25.2296 36.2887 20.1799 35.5764 15.3111 34.1731C15.2791 34.1625 15.2473 34.1625 15.2047 34.1625C14.8752 34.1944 13.3018 34.524 14.6519 38.2447V38.2554C15.3111 39.8075 16.406 41.838 18.1176 43.6984C16.5124 41.7955 18.4897 40.743 22.0084 41.1682C25.5273 41.5935 30.343 41.6041 30.343 41.6041C30.343 41.6041 35.1481 41.5935 38.6776 41.1682C42.1964 40.743 44.1737 41.7955 42.5685 43.6984C44.2801 41.838 45.375 39.8075 46.0341 38.2554V38.2447C47.3842 34.5133 45.8109 34.1838 45.4813 34.1625Z" fill="url(#paint10_linear_8284_585)"/>
<path d="M42.7702 39.3922C44.1097 39.1051 45.1196 37.9889 45.2471 36.6175L45.3747 35.2781C40.5058 36.6495 35.4562 37.3511 30.3534 37.3511C25.2506 37.3511 20.201 36.6495 15.332 35.2781L15.4596 36.6175C15.5872 37.9783 16.5971 39.0945 17.9366 39.3922C21.9976 40.2745 26.1649 40.7104 30.3534 40.7104C34.5419 40.7104 38.7092 40.2639 42.7702 39.3922Z" fill="url(#paint11_radial_8284_585)"/>
<defs>
<radialGradient id="paint0_radial_8284_585" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(25.8593 21.0934) scale(27.5731)">
<stop stop-color="#FFDF30"/>
<stop offset="1" stop-color="#FFB82E"/>
</radialGradient>
<radialGradient id="paint1_radial_8284_585" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(25.8592 21.0934) scale(21.693)">
<stop stop-color="#FFE95F"/>
<stop offset="1" stop-color="#FFBB47" stop-opacity="0"/>
</radialGradient>
<linearGradient id="paint2_linear_8284_585" x1="20.5113" y1="20.0456" x2="20.5113" y2="17.6372" gradientUnits="userSpaceOnUse">
<stop offset="0.00132565" stop-color="#3C2200"/>
<stop offset="1" stop-color="#7A4400"/>
</linearGradient>
<radialGradient id="paint3_radial_8284_585" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(22.2289 26.3725) rotate(73.8539) scale(3.22942 2.08938)">
<stop offset="0.00132565" stop-color="#7A4400"/>
<stop offset="1" stop-color="#643800"/>
</radialGradient>
<linearGradient id="paint4_linear_8284_585" x1="22.8964" y1="22.944" x2="22.8964" y2="26.0459" gradientUnits="userSpaceOnUse">
<stop offset="0.00132565" stop-color="#3C2200"/>
<stop offset="1" stop-color="#512D00"/>
</linearGradient>
<linearGradient id="paint5_linear_8284_585" x1="40.2064" y1="20.0456" x2="40.2064" y2="17.6372" gradientUnits="userSpaceOnUse">
<stop offset="0.00132565" stop-color="#3C2200"/>
<stop offset="1" stop-color="#7A4400"/>
</linearGradient>
<radialGradient id="paint6_radial_8284_585" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(37.1542 26.373) rotate(73.8539) scale(3.22942 2.08938)">
<stop offset="0.00132565" stop-color="#7A4400"/>
<stop offset="1" stop-color="#643800"/>
</radialGradient>
<linearGradient id="paint7_linear_8284_585" x1="37.8211" y1="22.944" x2="37.8211" y2="26.0459" gradientUnits="userSpaceOnUse">
<stop offset="0.00132565" stop-color="#3C2200"/>
<stop offset="1" stop-color="#512D00"/>
</linearGradient>
<radialGradient id="paint8_radial_8284_585" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30.3607 41.512) scale(12.5911 12.5911)">
<stop offset="0.00132565" stop-color="#7A4400"/>
<stop offset="1" stop-color="#643800"/>
</radialGradient>
<radialGradient id="paint9_radial_8284_585" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30.5464 45.9412) scale(10.4353 3.15458)">
<stop offset="0.2479" stop-color="#FF0000"/>
<stop offset="1" stop-color="#C10000"/>
</radialGradient>
<linearGradient id="paint10_linear_8284_585" x1="46.3968" y1="38.9241" x2="14.5056" y2="38.9241" gradientUnits="userSpaceOnUse">
<stop offset="0.00132565" stop-color="#3C2200"/>
<stop offset="0.5" stop-color="#512D00"/>
<stop offset="1" stop-color="#3C2200"/>
</linearGradient>
<radialGradient id="paint11_radial_8284_585" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30.3534 37.9992) scale(27.6125 27.6125)">
<stop offset="0.00132565" stop-color="white"/>
<stop offset="1" stop-color="#A8BBBD"/>
</radialGradient>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

import Head from 'next/head';

const Meta = (props) => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/static/favicon.png" />
    <style>
      @import
      url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
    </style>
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.13.0/css/all.css"
      integrity="sha384-Bfad6CLCknfcloXFOyFnlgtENryhrpZCe29RTifKEixXQZ38WheV+i/6YWSzkz3V"
      crossorigin="anonymous"
    />
    {/* <link rel="stylesheet" type="text/css" href="/static/nprogress.css" /> */}
    <title>The Talaria | {props.title}</title>
  </Head>
);

export default Meta;

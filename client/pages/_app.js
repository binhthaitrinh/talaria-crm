import App from 'next/app';
import Page from '../components/Page';

function MyApp({ Component, pageProps }) {
  return (
    <Page>
      <Component {...pageProps} />
    </Page>
  );
}

MyApp.getInitialProps = async (appCtx) => {
  const appProps = await App.getInitialProps(appCtx);

  return { ...appProps };
};

export default MyApp;

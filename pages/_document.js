import { Head, Html, Document } from "next/document";

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <body>{this.props.children}</body>
      </Html>
    );
  }
}

//    Copyright 2022 Shreyans Jain <DestroyerXyz> <shreyansthebest2007@gmail.com>
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Layout } from "components/layout";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ChakraProvider>
    );
}

export default MyApp;

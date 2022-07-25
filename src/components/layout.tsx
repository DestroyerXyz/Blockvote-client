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

import React, { ReactNode } from "react";
import { Text, Center, Container, useColorModeValue } from "@chakra-ui/react";

type Props = {
    children: ReactNode;
};

export function Layout(props: Props) {
    return (
        <div>
            <Container maxW="container.md" py="8">
                {props.children}
            </Container>
            <Center
                as="footer"
                bg={useColorModeValue("gray.100", "gray.700")}
                p={6}
            >
                <Text fontSize="md">Blockvote for TKS by Shreyans Jain</Text>
            </Center>
        </div>
    );
}

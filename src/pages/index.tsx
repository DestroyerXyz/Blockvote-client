import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { VStack, Heading, Box, LinkOverlay, LinkBox } from "@chakra-ui/layout";
import { abi } from "./Blockvote.json";
import {
    Flex,
    useColorModeValue,
    Spacer,
    Tooltip,
    Button,
    Input,
    FormControl,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Link,
    useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

declare let window: any;

// TODO: Vote function
// TODO: CreatePost function
const Home: NextPage = () => {
    const [currentAccount, setCurrentAccount] = useState<string | undefined>();
    const [post, setPost] = useState<any | undefined>();
    const [create, setCreate] = useState<boolean>(false);
    const [walletStatus, setWalletStatus] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("Untitled");
    const [desc, setDesc] = useState<string>("No Description");
    const [opt1, setOpt1] = useState<string>("1");
    const [opt2, setOpt2] = useState<string>("2");
    const [opt3, setOpt3] = useState<string>("3");
    const [opt4, setOpt4] = useState<string>("4");
    const toast = useToast();

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        if (!window.ethereum) {
            setWalletStatus(false);
            return;
        } else {
            setWalletStatus(true);
        }

        // const temp = window.ethereum.request({ method: "eth_chainId" });
        // console.log(temp);
        if (
            (await window.ethereum.request({ method: "eth_chainId" })) !=
            "0x13881"
        ) {
            await addChain();
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // const alchemy = new ethers.providers.AlchemyProvider(
        //     "maticmum",
        //     process.env.API_KEY
        // );
        const contract = new ethers.Contract(
            "0x6d21Df4D9a17348bfC392939130611Ff026Bb034",
            abi,
            provider
        );

        const postcount = await contract.fetchPostcount();
        console.log(postcount);

        var post = [];
        for (var x = postcount - 1, y = 0; x >= 0; x--, y++) {
            post[y] = await contract.fetchPosts(x);
        }
        console.log(post);
        setPost(post);

        provider
            .send("eth_requestAccounts", [])
            .then((accounts) => {
                if (accounts.length > 0) setCurrentAccount(accounts[0]);
            })
            .catch((e) => console.log(e));
    };

    const addChain = async () => {
        const chain = await window.ethereum
            .request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x13881" }],
            })
            .catch(async (result: any) => {
                if (result.code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x13881",
                                chainName: "Polygon Testnet",
                                nativeCurrency: {
                                    name: "MATIC",
                                    symbol: "MATIC",
                                    decimals: 18,
                                },
                                rpcUrls: [
                                    "https://polygontestapi.terminet.io/rpc",
                                ],
                                blockExplorerUrls: [
                                    "https://mumbai.polygonscan.com/",
                                ],
                            },
                        ],
                    });
                }
            });

        if (chain == null) {
            console.log("FFFFF");
            await new Promise((r) => setTimeout(r, 5000));
        }
    };

    const onClickDisconnect = () => {
        setCurrentAccount(undefined);
    };

    const vote = async (id: any, option: any) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
            "0x6d21Df4D9a17348bfC392939130611Ff026Bb034",
            abi,
            provider.getSigner()
        );

        const tx = await contract.vote(id, option);
        const rc = await tx.wait();
        toast({
            title: "Voting successful",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        init();
    };

    const createPost = async (
        title: string,
        description: string,
        option1: string,
        option2: string,
        option3: string,
        option4: string
    ) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
            "0x6d21Df4D9a17348bfC392939130611Ff026Bb034",
            abi,
            provider.getSigner()
        );
        const post = await contract.createPost(title, description, [
            option1,
            option2,
            option3,
            option4,
        ]);
        await post.wait();
        toast({
            title: "Post created successful",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        init();
        setCreate(false);
    };

    return (
        <>
            <Flex
                as="header"
                bg={useColorModeValue("gray.100", "gray.900")}
                p={4}
                alignItems="center"
            >
                <LinkBox>
                    <NextLink href={"/"} passHref>
                        <LinkOverlay>
                            <Heading size="md">Blockvote</Heading>
                        </LinkOverlay>
                    </NextLink>
                </LinkBox>
                <Spacer />
                <Box>
                    {currentAccount ? (
                        <Tooltip label={`Account: ${currentAccount}`}>
                            <Button
                                type="button"
                                w="100%"
                                onClick={onClickDisconnect}
                            >
                                Wallet Connected!
                            </Button>
                        </Tooltip>
                    ) : (
                        <Button type="button" w="100%" onClick={init}>
                            Connect Wallet
                        </Button>
                    )}
                </Box>
            </Flex>
            <Head>
                <title>Blockvote</title>
            </Head>
            {!walletStatus ? (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Wallet not found</AlertTitle>
                    <AlertDescription>
                        Please install an Ethereum wallet (
                        <Link
                            color="#2358C2"
                            href="https://metamask.io/"
                            isExternal
                        >
                            MetaMask
                        </Link>{" "}
                        Recommended)
                    </AlertDescription>
                </Alert>
            ) : (
                <></>
            )}
            {currentAccount ? (
                <>
                    <Heading as="h3" my={4}>
                        Latest Polls
                    </Heading>
                    <VStack>
                        {!create ? (
                            <Button
                                type="button"
                                w="100%"
                                onClick={() => setCreate(true)}
                            >
                                New Post
                            </Button>
                        ) : (
                            <Box
                                mb={0}
                                p={4}
                                w="100%"
                                borderWidth="1px"
                                borderRadius="lg"
                            >
                                <Heading my={2} fontSize="xl">
                                    Create Post
                                </Heading>

                                <VStack>
                                    {/* <FormControl> */}
                                    <FormControl isRequired>
                                        <VStack mt={2} spacing="15px">
                                            {/* <FormLabel>Title</FormLabel> */}
                                            <Input
                                                size="md"
                                                type="text"
                                                placeholder="Title"
                                                focusBorderColor="grey"
                                                aria-required="true"
                                                maxLength={32}
                                                errorBorderColor="red"
                                                onChange={(event) => {
                                                    console.log(
                                                        event.target.value
                                                    );
                                                    setTitle(
                                                        event.target.value
                                                    );
                                                }}
                                            />
                                            {/* </FormControl> */}
                                            {/* <FormControl isRequired> */}
                                            {/* <FormLabel>Description</FormLabel> */}
                                            <Input
                                                size="md"
                                                type="text"
                                                placeholder="Description"
                                                focusBorderColor="grey"
                                                maxLength={100}
                                                errorBorderColor="red"
                                                onChange={(event) => {
                                                    setDesc(event.target.value);
                                                }}
                                            />
                                            {/* </FormControl>
                                        <FormControl isRequired> */}
                                            {/* <FormLabel>Option 1</FormLabel> */}
                                            <Input
                                                size="md"
                                                type="text"
                                                placeholder="Option 1"
                                                focusBorderColor="grey"
                                                maxLength={50}
                                                errorBorderColor="red"
                                                onChange={(event) => {
                                                    setOpt1(event.target.value);
                                                }}
                                            />
                                            {/* </FormControl>
                                        <FormControl isRequired> */}
                                            {/* <FormLabel>Option 2</FormLabel> */}
                                            <Input
                                                size="md"
                                                type="text"
                                                placeholder="Option 2"
                                                focusBorderColor="grey"
                                                maxLength={50}
                                                errorBorderColor="red"
                                                onChange={(event) => {
                                                    setOpt2(event.target.value);
                                                }}
                                            />
                                            {/* </FormControl>
                                        <FormControl isRequired> */}
                                            {/* <FormLabel>Option 3</FormLabel> */}
                                            <Input
                                                size="md"
                                                type="text"
                                                placeholder="Option 3"
                                                focusBorderColor="grey"
                                                maxLength={50}
                                                errorBorderColor="red"
                                                onChange={(event) => {
                                                    setOpt3(event.target.value);
                                                }}
                                            />
                                            {/* </FormControl>
                                        <FormControl isRequired> */}
                                            {/* <FormLabel>Option 4</FormLabel> */}
                                            <Input
                                                size="md"
                                                type="text"
                                                placeholder="Option 4"
                                                focusBorderColor="grey"
                                                maxLength={50}
                                                errorBorderColor="red"
                                                onChange={(event) => {
                                                    setOpt4(event.target.value);
                                                }}
                                            />

                                            <Button
                                                type="submit"
                                                onClick={() => {
                                                    createPost(
                                                        String(title),
                                                        String(desc),
                                                        String(opt1),
                                                        String(opt2),
                                                        String(opt3),
                                                        String(opt4)
                                                    );
                                                }}
                                            >
                                                Submit
                                            </Button>

                                            {/* </FormControl> */}
                                        </VStack>
                                    </FormControl>
                                </VStack>
                            </Box>
                        )}
                        {post.map((x: any, y: any) => {
                            return (
                                <Box
                                    mb={0}
                                    p={4}
                                    w="100%"
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    key={y}
                                >
                                    <Heading my={4} fontSize="xl">
                                        {x[1]}
                                    </Heading>
                                    <Heading my={4} fontSize="l">
                                        {x[2]}
                                        <Heading my={1} fontSize="sm">
                                            by {x[0]}
                                        </Heading>
                                    </Heading>
                                    <VStack my={2}>
                                        <Button
                                            type="button"
                                            w="100%"
                                            onClick={() => {
                                                vote(y, 0);
                                            }}
                                        >
                                            {x[3][0]}:{" "}
                                            {(100 * Number(x[4][0])) /
                                                (Number(x[4][0]) +
                                                    Number(x[4][1]) +
                                                    Number(x[4][2]) +
                                                    Number(x[4][3])) || 0}
                                            %
                                        </Button>
                                        <Button
                                            type="button"
                                            w="100%"
                                            onClick={() => {
                                                vote(y, 1);
                                            }}
                                        >
                                            {x[3][1]}:{" "}
                                            {(100 * Number(x[4][1])) /
                                                (Number(x[4][0]) +
                                                    Number(x[4][1]) +
                                                    Number(x[4][2]) +
                                                    Number(x[4][3])) || 0}
                                            %
                                        </Button>
                                        <Button
                                            type="button"
                                            w="100%"
                                            onClick={() => {
                                                vote(y, 2);
                                            }}
                                        >
                                            {x[3][2]}:{" "}
                                            {(100 * Number(x[4][2])) /
                                                (Number(x[4][0]) +
                                                    Number(x[4][1]) +
                                                    Number(x[4][2]) +
                                                    Number(x[4][3])) || 0}
                                            %
                                        </Button>
                                        <Button
                                            type="button"
                                            w="100%"
                                            onClick={() => {
                                                vote(y, 3);
                                            }}
                                        >
                                            {x[3][3]}:{" "}
                                            {(100 * Number(x[4][3])) /
                                                (Number(x[4][0]) +
                                                    Number(x[4][1]) +
                                                    Number(x[4][2]) +
                                                    Number(x[4][3])) || 0}
                                            %
                                        </Button>
                                    </VStack>
                                </Box>
                            );
                        })}
                    </VStack>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default Home;

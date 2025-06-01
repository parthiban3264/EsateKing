import prisma from "../lib/prisma.js";


export const getChats = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chats = await prisma.chat.findMany({
            where: {
                userIds: {
                    has: tokenUserId,
                },
            },
        });

        for (const chat of chats){
            const receiverId =chat.userIds.find((id) => id !== tokenUserId);

            const receiver = await prisma.user.findUnique({
                where:{
                    id:receiverId,
                },
                select:{
                    id:true,
                    userName: true,
                    avatar:true,
                },
            });
            chat.receiver = receiver;
        }

        res.status(200).json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get chats!" });
    }
};


export const getChat = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.id;

    try {
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                userIds: {
                    has: tokenUserId, // checks if tokenUserId is a participant
                },
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt:"asc",
                    },
                },
            },
        });

        await prisma.chat.update({
            where:{
                id: chatId,
            },
            data:{
                seenBy:{
                    set:[tokenUserId],
                }
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found or access denied." });
        }

        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get chat!" });
    }
};


export const addChat = async (req, res) => {
   
    const tokenUserId = req.userId;
    try {
        const newChat = await prisma.chat.create({
            data:{
                userIds: [tokenUserId, req.body.receiverId]
            }
        })
        res.status(200).json(newChat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to Add Chat!" });
    }
};

export const readChat = async (req, res) => {

    const tokenUserId = req.userId;
    const chatId = req.params.id;
    try {
        const chat = await prisma.user.update({
            where:{
                id: chatId,
            userIds:{
                has: [tokenUserId]
            },
            },
            data:{
                seenBy:{
                    set:[tokenUserId],
                },
            },
            
        });
        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to read Chat!" });
    }
};

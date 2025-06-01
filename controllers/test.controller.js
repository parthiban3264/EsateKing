import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
    console.log(req.userId);
    res.status(200).json({Message:"You Are Authenticated"});
};

export const shouldBeAdmin = async (req, res) => {

    const token = req.cookies.token;

    if(!token) return res.status(401).json({Message:"Not Authenticated!"});

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err) return res.status(403).json({Message:"Token is not Valid!"});
        if(!payload.isAdmin) {
           return res.status(403).json({Message:"Not Authorized!"}); 
        }
    });
     res.status(200).json({Message:"You Are Authenticated"});
};
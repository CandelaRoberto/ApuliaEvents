import jwt from 'jsonwebtoken';

const genToken=(UserId,res)=>{
    const token=jwt.sign({UserId}, process.env.JWT_SECRET,{
        expiresIn:'10d',
    });

    res.cookie('jwt',token,{
        maxAge:10*24*60*60*1000,
        httpOnly:true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    })};

export default genToken;


 


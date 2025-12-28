const jwt = require("jsonwebtoken")
async function userAuth(req,res,next){
    const token = req.headers.authorisation;
    const decodedInfo = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    const userId = decodedInfo.userId;
    if(userId){
        req.userId = userId;
        next();
    } else {
        res.status(409).json({
            message: "Please sign in."
        })
    }
}

module.exports = {
    userAuth
}
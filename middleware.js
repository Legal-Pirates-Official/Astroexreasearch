module.exports.isloggedin = (req,res,next)=>{
    const sess = req.session.loginuser
    const yep = 'Yes'
    if (sess !== yep) {
        res.redirect('/admin/login');
    }else{
        next();
    }
}

const exp=require('express')
const authorApp=exp.Router();
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor = require('./createUserOrAuthor');
const Article=require("../models/articlemodel")
const {requireAuth}=require("@clerk/express")
require('dotenv').config()
//API


//create new author
authorApp.post("/author",expressAsyncHandler(createUserOrAuthor))

//create new article
authorApp.post("/article",expressAsyncHandler(async(req,res)=>{
    //get new article obj from req
    const newArticleObj=req.body;
    const newArticle=new Article(newArticleObj);
    const articleObj=await newArticle.save();
    res.status(201).send({message:"article published",payLoad:articleObj})

}))



//read all articles
authorApp.get('/articles',expressAsyncHandler(async(req,res)=>{
    //read all articles from database
    const listOfArticles=await Article.find({isArticleActive:true});
    res.status(200).send({message:"articles",payLoad:listOfArticles})
}))

//modify an article by article id
authorApp.put('/article/:articleId',expressAsyncHandler(async(req,res)=>{
    const modifiedArticle=req.body;
    //update article by articleId
    const latestArticle=await Article.findByIdAndUpdate(modifiedArticle._id,
        {...modifiedArticle},
        {returnOriginal:false})
    //send res
    res.status(200).send({message:"article modified",payLoad:latestArticle})
})) 



//delete(soft delete) an article by article id
authorApp.put('/articles/:articleId',expressAsyncHandler(async(req,res)=>{
    try{
    const modifiedArticle=req.body;
    //update article by articleId
    const latestArticle=await Article.findByIdAndUpdate(modifiedArticle._id,
        {...modifiedArticle},
        {returnOriginal:false})
    //send res
    res.status(200).send({message:"article deleted",payLoad:latestArticle})
    }
    catch(err)
    {
        console.log(err.message)
    }
})) 

module.exports=authorApp;
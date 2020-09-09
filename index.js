const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const helmet = require('helmet');  was causing issues importing Vue
const yup = require('yup');
const { nanoid } = require('nanoid');
const monk = require('monk');

require('dotenv').config();

const db = monk(process.env.MONGODB_URI);
const urls = db.get('urls');
urls.createIndex({alias:1}, {unique:true});

const app = express();
const port = process.env.PORT || 420;

// app.use(helmet());  was causing issues importing Vue
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/:id', async(req,res) =>{
    // Redirect to URL

    const{id: alias} = req.params;

    try {
        const url = await urls.findOne({alias});
        
        if(url){
            res.redirect(url.url);
        }  

        res.redirect(`/?error=${alias} not found`) 

    } catch (error) {
        res.redirect(`/?error=Nothing here m8`) 
    }
});

// app.get('/url/:id', (req,res) =>{
//     // get a URL
// });

const schema = yup.object().shape({
    alias: yup.string().trim().matches(/[\w\-]/i),
    url:   yup.string().trim().url().required(),
});

app.post('/url', async(req,res,next) =>{
    // Create a URL

    let {alias, url} = req.body;

    try{

        await schema.validate({
            alias, url,
        });

        if(!alias){
           alias = nanoid(5); 
        }

        alias = alias.toLowerCase();
        // const secret = nanoid(8).toLowerCase();

        const newURL = {
            url,
            alias,
            // secret
        };

        const created = await urls.insert(newURL);
        res.json(created);
        
    } 
    catch(error){
        
        if(error.message.startsWith('E11000')){
            error.message = 'Alias already exists';
        }

        next(error);
    }
});

// Error handler
app.use((error, req, res, next) => {

    if(error.status){
        res.status(error.status);
    }
    else{
        res.status(500);
    }

    res.json({
        message: error.message,
        stack:  process.env.NODE_ENV === 'production' ? 'AAAAAAAAAAAAAAAA' : error.stack,
    });
}); 

app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`);
});
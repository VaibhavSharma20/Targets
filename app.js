const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const app = express();
const _ = require("lodash");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://Admin:20-January@targets.gysp0.mongodb.net/TargetsDB",{useNewUrlParser: true});

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item",itemSchema);

const item1= new Item({
    name:"Welcome to Targets Web App!"
});

const item2= new Item({
    name:"Hit + to add"
});

const item3= new Item({
    name:"Check box to delete"
});

const defaultItems=[item1,item2,item3];

const listSchema={
    name:String,
    items:[itemSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){
    Item.find({},function(err, foundItems){
        if(foundItems.length == 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Sucessfully added default items.")
                }
            });
            res.redirect("/");
        }
        else{
            res.render("lists",{listTitle:"Today", newListItems:foundItems});
        }
    });
});

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else{
                res.render("lists",{listTitle: foundList.name, newListItems:foundList.items});
            }
        }
    })
});

app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const item = new Item({
        name:itemName
    });
    if(listName==="Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete",function(req,res){
    const checkedItemId= req.body.checkBox;
    const listName= req.body.listName;
    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(err){
             console.log(err);
            }
            res.redirect("/");
        });
    }
    else{
        List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedItemId}}}, function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }    
});


app.post("/search",function(req,res){
    const searchList= _.capitalize(req.body.searchList);
    res.redirect("/"+searchList);
});

let port = process.env.PORT;
if(port==null || port==""){
    port=3000;
}

app.listen(port,function(){
    console.log("Todo-List server started on port 3000");
});
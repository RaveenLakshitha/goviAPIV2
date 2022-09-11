const fs = require("fs");
const dotenv = require("dotenv");
//const Questions = require("./models/Forum/Questions");
dotenv.config({ path: "./config/config.env" });
//const Questions = require("./data/Questions.json");
const infoCategoriesModel = require("./models/Categories/infoCategory");
const itemCategoriesModel = require("./models/Categories/itemCategories");
const forumCategoriesModel = require("./models/Categories/forumCategories");
const rentITemsCategoriesModel = require("./models/Categories/rentItemsCategories");
const infoModel = require("./models/Information/information");
const itemModel = require("./models/Items&Rent/item");
const questModel = require("./models/Forum/Questions");
const ansModel = require("./models/Forum/Answers");
const shopModel = require("./models/shop");
const expertModel = require("./models/Experts/experts");
const architectModel = require("./models/Architects/architect");
const projectModel = require("./models/Architects/projects");
const userModel = require("./models/user");
const articleModel = require("./models/Information/articles");
const rentItemsModel = require("./models/Items&Rent/RentItems");
const archiRecordModel = require("./models/Statistics/ArchitectRecords");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const infoCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Categories/category-info.json`, "utf-8")
);
const itemCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Categories/category-items.json`, "utf-8")
);
const rentItemsCategories = JSON.parse(
  fs.readFileSync(
    `${__dirname}/data/Categories/category-rentItems.json`,
    "utf-8"
  )
);
const forumCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Categories/category-forum.json`, "utf-8")
);

const info = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Information/information.json`, "utf-8")
);
const articles = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Information/articles.json`, "utf-8")
);
const items = JSON.parse(
  fs.readFileSync(`${__dirname}/data/items.json`, "utf-8")
);
const rentitems = JSON.parse(
  fs.readFileSync(`${__dirname}/data/rentItems.json`, "utf-8")
);
const projects = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Architects/projects.json`, "utf-8")
);
const shops = JSON.parse(
  fs.readFileSync(`${__dirname}/data/shops.json`, "utf-8")
);
const architects = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Architects/Architects.json`, "utf-8")
);
const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Questions.json`, "utf-8")
);
const answers = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Answers.json`, "utf-8")
);
const experts = JSON.parse(
  fs.readFileSync(`${__dirname}/data/experts.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
);
const archiRecords = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Architects/ArchiRecords.json`, "utf-8")
);

//#########################################################################
//Add Info Category Data
const importDataInfoCat = async () => {
  try {
    await infoCategoriesModel.create(infoCategories);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataInfoCat = async () => {
  try {
    await infoCategoriesModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-infoCat") {
  importDataInfoCat();
} else if (process.argv[2] === "-d" && process.argv[3] === "-infoCat") {
  deleteDataInfoCat();
}
//#########################################################################
//Add Info Category Data
const importArchiRecordData = async () => {
  try {
    await archiRecordModel.create(archiRecords);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteArchiRecordData = async () => {
  try {
    await archiRecordModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-archiRecords") {
  importArchiRecordData();
} else if (process.argv[2] === "-d" && process.argv[3] === "-archiRecords") {
  deleteArchiRecordData();
}
//#########################################################################
//Add Info Category Data
const importArticleData = async () => {
  try {
    await articleModel.create(articles);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataArticle = async () => {
  try {
    await articleModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-article") {
  importArticleData();
} else if (process.argv[2] === "-d" && process.argv[3] === "-article") {
  deleteDataArticle();
}
///######################################################################
//#########################################################################
//Add Info Category Data
const importDataProjects = async () => {
  try {
    await projectModel.create(projects);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataProjects = async () => {
  try {
    await projectModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-projects") {
  importDataProjects();
} else if (process.argv[2] === "-d" && process.argv[3] === "-projects") {
  deleteDataProjects();
}
///######################################################################
//#########################################################################
//Add Info Category Data
const importDataArchi = async () => {
  try {
    await architectModel.create(architects);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataArchi = async () => {
  try {
    await architectModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-archi") {
  importDataArchi();
} else if (process.argv[2] === "-d" && process.argv[3] === "-archi") {
  deleteDataArchi();
}
///######################################################################
//#########################################################################
//Add Forum Category Data
const importDataForumCat = async () => {
  try {
    await forumCategoriesModel.create(forumCategories);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataForumCat = async () => {
  try {
    await forumCategoriesModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-forumCat") {
  importDataForumCat();
} else if (process.argv[2] === "-d" && process.argv[3] === "-forumCat") {
  deleteDataForumCat();
}
///######################################################################
//Add Forum Category Data
const importDataQusetions = async () => {
  try {
    await questModel.create(questions);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataQusetions = async () => {
  try {
    await questModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-quest") {
  importDataQusetions();
} else if (process.argv[2] === "-d" && process.argv[3] === "-quest") {
  deleteDataQusetions();
}
///######################################################################
//Add Forum Category Data
const importDataAnswers = async () => {
  try {
    await ansModel.create(answers);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataAnswers = async () => {
  try {
    await ansModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-answers") {
  importDataAnswers();
} else if (process.argv[2] === "-d" && process.argv[3] === "-answers") {
  deleteDataAnswers();
}
///######################################################################
//#########################################################################
//Add Data
const importDataRentItemsCat = async () => {
  try {
    await rentITemsCategoriesModel.create(rentItemsCategories);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataRentItemsCat = async () => {
  try {
    await rentITemsCategoriesModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-rentItemCat") {
  importDataRentItemsCat();
} else if (process.argv[2] === "-d" && process.argv[3] === "-rentItemCat") {
  deleteDataRentItemsCat();
}
//#########################################################################
//Add Data
const importDataRentItems = async () => {
  try {
    await rentItemsModel.create(rentItemsCategories);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataRentItems = async () => {
  try {
    await rentItemsModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-rentItem") {
  importDataRentItems();
} else if (process.argv[2] === "-d" && process.argv[3] === "-rentItem") {
  deleteDataRentItems();
}
///######################################################################
//#########################################################################
//Add Item category Data
const importDataItemCat = async () => {
  try {
    await itemCategoriesModel.create(itemCategories);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataItemCat = async () => {
  try {
    await itemCategoriesModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-itemCat") {
  importDataItemCat();
} else if (process.argv[2] === "-d" && process.argv[3] === "-itemCat") {
  deleteDataItemCat();
}
///######################################################################
//#########################################################################
//Add Info Data
const importDataInfo = async () => {
  try {
    await infoModel.create(info);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataInfo = async () => {
  try {
    await infoModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-info") {
  importDataInfo();
} else if (process.argv[2] === "-d" && process.argv[3] === "-info") {
  deleteDataInfo();
}
///######################################################################
//#########################################################################
//Add Item Data
const importDataItem = async () => {
  try {
    await itemModel.create(items);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataItem = async () => {
  try {
    await itemModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-item") {
  importDataItem();
} else if (process.argv[2] === "-d" && process.argv[3] === "-item") {
  deleteDataItem();
}
///######################################################################
//#########################################################################
//Add Data to shops
const importDataShops = async () => {
  try {
    await shopModel.create(shops);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataShops = async () => {
  try {
    await shopModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-shops") {
  importDataShops();
} else if (process.argv[2] === "-d" && process.argv[3] === "-shops") {
  deleteDataShops();
}
///######################################################################
//#########################################################################
//Add Data to shops
const importDataUsers = async () => {
  try {
    await userModel.create(users);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataUsers = async () => {
  try {
    await userModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-users") {
  importDataUsers();
} else if (process.argv[2] === "-d" && process.argv[3] === "-users") {
  deleteDataUsers();
}
///######################################################################
//#########################################################################
//Add Data to shops
const importDataExperts = async () => {
  try {
    await expertModel.create(experts);
    console.log("data Imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete Data
const deleteDataExperts = async () => {
  try {
    await expertModel.deleteMany();
    console.log("All data Destoyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i" && process.argv[3] === "-experts") {
  importDataExperts();
} else if (process.argv[2] === "-d" && process.argv[3] === "-experts") {
  deleteDataExperts();
}
///######################################################################

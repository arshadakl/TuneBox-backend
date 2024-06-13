import mongoose from "mongoose";

export const DBConnection = ()=>{
    mongoose.connect(process.env.DB_HOST ).then(()=>{
        console.log("Database Connected..");
    })
}

// export default DBConnection
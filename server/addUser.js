import User from "./models/UserModel.js";

export const addUser = async () => {
    try {
        const user = await new User({
            username: "quanna5924",
            fullname: "Nguyễn Anh Quân",
            password: "123456", 
            role: "staff",
            avatar: null,
        });
        await user.save();
        console.log("Add user successfully");
    } catch (error) {
        console.log(error);
    }
}

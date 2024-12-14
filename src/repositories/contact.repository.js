import mongoose from "mongoose"
import User from "../models/user.model.js"

class ContactReposiroty{

    static deleteContactFromContactListById = async (user_id, contact_id) => {
        const result = await User.updateOne(
            {_id: user_id},
            {$pull: {contacts: {userId: contact_id}}}
        )
        return result
    }

}

export default ContactReposiroty
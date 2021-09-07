import dotenv from "dotenv";
import CryptoJs from "crypto-js";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

dotenv.config();

async function followUser(req: Request, res: Response) {
	const { user_id } = req.query;
	const new_token = req.new_token ? req.new_token : null;
	req.new_token = null;

	const current_user: string = CryptoJs.AES.decrypt(
		req.auth,
		`${process.env.SHUFFLE_SECRET}`
	).toString(CryptoJs.enc.Utf8);
	req.auth = null;

	const user = await User.findById(user_id);

	if (!user) {
		return res.jsonNotFound(null, "User not found", new_token);
	}

	user.followers.includes(new mongoose.Schema.Types.ObjectId(current_user))
		? (user.followers = user.followers.filter(function (_id) {
				return _id.toString() !== current_user;
		  }))
		: user.followers.push(new mongoose.Schema.Types.ObjectId(current_user));

	user.updatedAt = new Date();

	let changes = user.getChanges();

	user
		.save()
		.then(() => {
			User.findById(current_user)
				.then((c_user) => {
					if (c_user === null) {
						return res.jsonNotFound(null, null, new_token);
					}
					c_user.following.includes(new mongoose.Schema.Types.ObjectId(user_id))
						? (c_user.following = c_user.following.filter(function (_id) {
								if (_id.toString() !== user_id!.toString())
									return new mongoose.Schema.Types.ObjectId(_id.toString());
						  }))
						: c_user.following.push(
								new mongoose.Schema.Types.ObjectId(user_id)
						  );

					c_user
						.save()
						.then((answer) => {
							console.log(answer);
							return res.jsonOK(changes, "user follow well succeed", new_token);
						})
						.catch((err) => {
							console.log(err);
							return res.jsonServerError(null, null, err.toString());
						});
				})
				.catch((err) => {
					console.log(err);
					return res.jsonServerError(null, null, err.toString());
				});
		})
		.catch((err) => {
			console.log(err);
			return res.jsonServerError(null, null, err.toString());
		});
}

export default { followUser };

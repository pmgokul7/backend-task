import axios from "axios";

export const getIpInfo = async (ip) => {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);

        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}



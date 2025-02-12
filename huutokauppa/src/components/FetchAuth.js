  async function getAuth() {
    try {
      const response = await fetch(process.env.EXTERNAL_API_URL + "/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log("GET AUTH SUCCESFULL");
        userdata = {
          name: result.name,
        };
        console.log(result);
      } else {
        console.log("GET AUTH FAILED");
      }
    } catch (error) {
      console.log("ERROR DURING GET AUTH", error);
    }
  }
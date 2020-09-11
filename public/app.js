const app = new Vue({
    el: '#app',
    data:{
        url: '',
        alias: '',
        created: null
    },

    methods:{
        async createURL(){
            console.log(this.url, this.alias);
                const response = await fetch('/url',{
                method: 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    url: this.url,
                    alias: this.alias
                })
            });

            this.created = await response.json();
        },

        showData(created){
            const obj = JSON.stringify(created,null,2);
            const data = JSON.parse(obj);

            if (data.stack){
                if(data.stack.startsWith("ValidationError: url is a required field")){
                    return "Error, please insert an URL."
                }
                else if(data.stack.startsWith("ValidationError: alias must match the following")){
                    return "Error, the alias is invalid, choose another one that only includes characters, numbers or _ .";
                }
                else if(data.stack.startsWith("MongoError: Alias already exists")){
                    return "Error, alias already exists, choose another one.";
                }
                else{
                    return data;
                }
            }
            else{
                data_alias = data.alias;
                return document.URL+data_alias;
            }
        },

        async copyURL(){
            var copyText = document.getElementById("newUrl");
            console.log(copyText.innerHTML);
            navigator.clipboard.writeText(copyText.innerHTML);

        },

    }
})
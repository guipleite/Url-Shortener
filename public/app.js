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
                return "Error, alias already exists or is invalid, choose another one";
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
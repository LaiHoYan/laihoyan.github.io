        const user = "LaiHoYan";
        const repo = "laihoyan.github.io";
        const branche = "main";
        const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branche}`;


        NestGitTree(user, repo, branche).then(function() {
            CacheDirAccess("assets/img");
            document.getElementById("json").innerHTML = prettyPrintJson.toHtml(dirAccessCache);


            html = "";
            dirAccessCache.childs.forEach(file => {
                html += AddImg(file.path);
            });
            document.getElementById("imgArea").innerHTML = html;

        });

        function AddImg(src) {
            return `<img src="${src}"></img>`;
        }
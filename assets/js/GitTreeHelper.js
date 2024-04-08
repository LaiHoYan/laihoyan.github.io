    /////////////////////////////////////////////////////////////////////////////
    // >Class 
    /////////////////////////////////////////////////////////////////////////////
    class Item {
        constructor(path, name, isfolder) {
            this.path = (path === "") ? name : `${path}/${name}`;
            this.name = name;
            this.isFolder = isfolder;
            this.childs = [];
        }
    }
    /////////////////////////////////////////////////////////////////////////////
    // >Class 
    /////////////////////////////////////////////////////////////////////////////


    gitTree = new Item("", "", true);
    let dirAccessCache;


    /////////////////////////////////////////////////////////////////////////////
    // >function 
    /////////////////////////////////////////////////////////////////////////////
    ///////////////////
    // >Helper 
    ///////////////////
    function IsFolder(name) {
        return !name.includes(".");
    }

    function GetSize(obj) {
        return new TextEncoder().encode(JSON.stringify(obj)).length
    }
    ///////////////////
    // Helper> 
    ///////////////////
    ///////////////////
    // >Git  
    ///////////////////
    async function GetRootFiles(url) {
        const list = await fetch(url).then(res => res.json());
        return list.tree.map(node => node.path);
    }
    async function GetNodeChilds(nodePath) {
        nodePath = nodePath.split('/').filter(Boolean);
        const dir = await nodePath.reduce(async(acc, dir) => {
            const {
                url
            } = await acc;
            const list = await fetch(url).then(res => res.json());
            return list.tree.find(node => node.path === dir);
        }, {
            url
        });

        if (dir) {
            const list = await fetch(dir.url).then(res => res.json());
            map = list.tree.map(node => node.path);
            return map;
        }
    }
    ///////////////////
    // Git> 
    ///////////////////
    ///////////////////
    // >Nesting  
    ///////////////////
    async function NestGitTree() {

        files = await GetRootFiles(url);

        await NestNode(gitTree, files);
    }
    async function NestNode(currentNode, filesArray) {
        for (let index = 0; index < filesArray.length; index++) {
            const file = filesArray[index];

            childNode = new Item(currentNode.path, file, IsFolder(file));
            currentNode.childs.push(childNode);

            if (childNode.isFolder) {
                nextChildArray = await GetNodeChilds(childNode.path);
                await NestNode(childNode, nextChildArray);
            }
        }
    }
    ///////////////////
    // Nesting> 
    ///////////////////
    ///////////////////
    // >AccessDir  
    ///////////////////

    function CacheDirAccess(path) {
        index = 0;
        return FindNodeByPath(gitTree, path);
    }

    function FindNodeByPath(node, path) {
        for (let index = 0; index < node.childs.length; index++) {
            c = node.childs[index];
            if (c.path === path) {
                dirAccessCache = c;
                return;
            } else
                FindNodeByPath(c, path);

        }
    }
    ///////////////////
    // AccessDir>  
    ///////////////////
    /////////////////////////////////////////////////////////////////////////////
    // function> 
    /////////////////////////////////////////////////////////////////////////////
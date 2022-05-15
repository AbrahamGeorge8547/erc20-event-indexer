import os from 'os'


const app = () => {
    console.log(process.argv[2], os.cpus().length)
    
}


app();
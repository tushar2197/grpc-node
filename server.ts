import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from './proto/random'
import { RandomHandlers } from './proto/randomPackage/Random'

const PORT = 8082
const protoFile = './proto/random.proto'
const packageDef = protoLoader.loadSync(path.resolve(__dirname, protoFile))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;
const randomPackage = grpcObj.randomPackage;

function main() {
    const server = getServer();
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(err)
        }
        console.log(`server start sucess ${PORT}`)
        server.start()
    })
}
function getServer() {
    const server = new grpc.Server();
    server.addService(randomPackage.Random.service, {
        "pingPong": (req: any, res: any) => {
            console.log(req, res)
        }
    } as unknown as RandomHandlers)
    return server;
}

main()

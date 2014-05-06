namespace cpp queryengine

service QueryService {  
    string GetCompletion(1:string prefix 2:string line, 3:string content)  
}  

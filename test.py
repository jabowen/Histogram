f = open("test.txt", "r")
inps={}

inp=f.readline()
while(inp!=None):
    if(not(inp in inps)):
        print(inp)
        inps[inp]=inp
    inp=f.readline()


f.close() 
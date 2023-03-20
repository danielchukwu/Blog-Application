with open('categories.txt', mode='r') as f:
   # data = f.readline()
   categories = list()
   for data in f.readlines():
      categories.append(data[0: len(data)-1])
   
   print(categories)
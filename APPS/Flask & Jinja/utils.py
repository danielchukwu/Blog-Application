# codes ['short', 'characters']

def is_valid_password(password, issue_list):
   if len(password) < 8:
      issue_list.append('short')
      return False

   valid_character_count = 0
   allowed_symbols = ('@', '$', '&', '_', '!')
   for i in password:
      if i.islower():
         valid_character_count += 1
      elif i.isupper():
         valid_character_count += 1
      elif i.isdigit():
         valid_character_count +=1
      elif i in allowed_symbols:
         valid_character_count +=1
      else:
         print(i)
         issue_list.append('characters')
         break

   if len(password) == valid_character_count:
      # valid password
      return True
   else: 
      # invalid password
      return False

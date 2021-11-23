# Database

## Tables

1. Tests
   - author
   - name
   - description
   - password
   - User
   - added (date)
   - modified (date)
2. Questions
   - text
   - answers
     - answer
     - isRight
   - #test
   - type _(only multiple choice for now)_
3. User _For later_
   - username
   - password
   - displayName
4. Comment
   - Question
   - Author
   - User
   - text
   - posted (date)
5. UserToken
   - user
   - token
   - expireAt
     - if DO_NOT_EXPIRE: - never expire
     - if > 0: expire at given time
     - if DO_NOT_GEN: don't generate token
   - expireIn - number of days after which to expire a token
     - -1 : do not expire
     - 0 : do not save
     - \>0: number of days

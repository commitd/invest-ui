
:: Install some global helpers
call yarn global add lerna typedoc 

:: Boostrap
call yarn bootstrap

:: Set up links for others
call yarn link:libs


import { Connection } from 'mysql';
import sqlstring from 'sqlstring';

class userSQL {
   private connection: Connection;
   private database: string;

   constructor(connection: Connection) {
      this.connection = connection;
      this.database = 'users';
      this.init();
   }

   public init(): void {
      const query =
         'CREATE TABLE IF NOT EXISTS `' +
         this.database +
         '` (`key` varchar(500) NOT NULL,`username` varchar(50) NOT NULL,PRIMARY KEY (`key`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;';
      this.connection.query(query);
      return;
   }

   public getUser(uploadKey: string): any {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format(
               'SELECT * FROM ' + this.database + ' WHERE `key` = ?',
               [uploadKey],
            ),
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public getAllUsers(): any {
      return new Promise((resolve, reject) => {
         this.connection.query(
            'SELECT * FROM ' + this.database,
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public deleteUser(uploadKey: string): any {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format(
               'DELETE FROM ' + this.database + ' WHERE `key` = ?',
               [uploadKey],
            ),
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public updateUser(
      newUploadKey: string,
      username: string,
      uploadKey: string,
   ): any {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format(
               'UPDATE ' +
                  this.database +
                  ' SET `username` = ?, `key` = ? WHERE `key` = ?',
               [username, newUploadKey, uploadKey],
            ),
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }

   public createNewUser(uploadKey: string, username: string) {
      return new Promise((resolve, reject) => {
         this.connection.query(
            sqlstring.format(
               'INSERT INTO ' +
                  this.database +
                  ' (`KEY`, `USERNAME`) VALUES (?, ?)',
               [uploadKey, username],
            ),
            (error, results, fields) => {
               if (error) {
                  reject(error);
               } else {
                  resolve(results);
               }
            },
         );
      });
   }
}

export default userSQL;
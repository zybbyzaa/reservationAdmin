'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');

class HomeController extends Controller {
  async index() {
    const htmlStr = await fs.readFileSync('app/public/index.html', 'utf-8');
    this.ctx.logger.info(htmlStr);
    this.ctx.body = htmlStr;
  }
}

module.exports = HomeController;

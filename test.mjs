import assert from 'assert';

import puppeteer from 'puppeteer';

describe('Test Thresholdmann', () => {
  let browser, page;

  before(async function () {
    // eslint-disable-next-line no-invalid-this
    this.timeout(5000);
    browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();
    await page.goto('http://127.0.0.1:8080');
  });

  describe('Unit tests', () => {
    describe('Trivial test', () => {
      it('should say hey', async () => {
        const res = await page.evaluate(() => window.location);
        assert.ok(res.origin);
      });
    });
  });

  describe('End to end tests', () => {
    describe('Load a file', () => {
      it('should display title', async () => {
        const title = await page.evaluate(() => document.title);
        assert.strictEqual(title, 'Thresholdmann');
      });
      it('should display "Choose..." message', async () => {
        const msg = await page.evaluate(() => document.querySelector('.box_input').innerText);
        assert.strictEqual(msg, '\nChoose a .nii.gz or a .nii file or drag it here.');
      });
      it('init with test nifti file', async () => {
        const pathString = './img/bear_uchar.nii.gz';
        const res = await page.evaluate(async (path) => {
          await window.initWithPath(path);

          return typeof window.globals.mv.mri;
        }, pathString);
        assert.strictEqual(res, 'object');
      }).timeout(5000);
    });
  });

});

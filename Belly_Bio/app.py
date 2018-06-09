# import necessary libraries
import numpy as np

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import text
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/belly_button_biodiversity.sqlite"

db = SQLAlchemy(app)
engine = create_engine('sqlite:///db/belly_button_biodiversity.sqlite')

class otu(db.Model):
    __tablename__ = 'otu'

    otu_id = db.Column(db.Integer, primary_key=True)
    lowest_taxonomic_unit_found = db.Column(db.String(64))

    def __repr__(self):
        return '<otu %r>' % (self.name)


class samples(db.Model):
    __tablename__ = 'samples'
    otu_id = db.Column(db.Integer, primary_key=True)
    def __repr__(self):
         return '<otu %r>' % (self.name)


class samples_meta(db.Model):
    __tablename__ = 'samples_metadata'

    SAMPLEID = db.Column(db.Integer, primary_key=True)
    EVENT	 = db.Column(db.String)
    ETHNICITY	 = db.Column(db.String)
    GENDER	 = db.Column(db.String)
    AGE	 = db.Column(db.Integer)
    WFREQ	 = db.Column(db.Integer)
    BBTYPE	= db.Column(db.String)
    LOCATION	= db.Column(db.String)
    COUNTRY012	= db.Column(db.String)
    ZIP012	= db.Column(db.String)
    COUNTRY1319	= db.Column(db.String)
    ZIP1319	= db.Column(db.String)
    DOG	= db.Column(db.String)
    CAT	= db.Column(db.String)
    IMPSURFACE013	 = db.Column(db.Integer)
    NPP013	 = db.Column(db.Float)
    MMAXTEMP013	= db.Column(db.Float)
    PFC013	= db.Column(db.Float)
    IMPSURFACE1319 = db.Column(db.Integer)
    NPP1319	= db.Column(db.Float)
    MMAXTEMP1319	= db.Column(db.Float)
    PFC1319= db.Column(db.Float)

    def __repr__(self):
        return '<samples_meta %r>' % (self.name)

#@app.before_first_request
#def setup():
    # Recreate database each time for demo
#    db.drop_all()
#    db.create_all()


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/names")
def samps():
    results=db.session.query(samples_meta.SAMPLEID).all()
    #results = db.session.query(Pet.type, func.count(Pet.type)).group_by(Pet.type).all()

    samp_names = ["BB_"+str(result[0]) for result in results]
    #age = [result[1] for result in results]

    name_data = {
        "sample names": samp_names,
    }

    return jsonify(name_data)

@app.route("/otu")
def otus():
    results=db.session.query(otu.lowest_taxonomic_unit_found).all()


    otu_desc = [str(result[0]) for result in results]
    #otu_desc=[1,2,3,55,2,3]

    otu_data = {
        "otu_desc": otu_desc

    }

    return jsonify(otu_data)


@app.route("/metadata/<sample>")
def sample_info(sample): 
    simpler_name = int(sample.replace("BB_","")) 
    age_data=db.session.query(samples_meta.AGE).filter(samples_meta.SAMPLEID == simpler_name).first()
    bbtype_data=db.session.query(samples_meta.BBTYPE).filter(samples_meta.SAMPLEID == simpler_name).first()
    ethnicity_data=db.session.query(samples_meta.ETHNICITY).filter(samples_meta.SAMPLEID == simpler_name).first()
    gender_data=db.session.query(samples_meta.GENDER).filter(samples_meta.SAMPLEID == simpler_name).first()
    location_data=db.session.query(samples_meta.LOCATION).filter(samples_meta.SAMPLEID == simpler_name).first()
    sampleid_data=db.session.query(samples_meta.SAMPLEID).filter(samples_meta.SAMPLEID == simpler_name).first()
    results = {
        "AGE":age_data[0],
        "BBTYPE":bbtype_data[0],
        "ETHNICITY":ethnicity_data[0],
        "GENDER":gender_data[0],
        "LOCATION":location_data[0],
        "SAMPLEID":sampleid_data[0]
    }
    return jsonify(results)

@app.route("/wfreq/<sample>")
def freq_washing(sample):
    simpler_name = int(sample.replace("BB_","")) 

    wfreq_data=db.session.query(samples_meta.WFREQ).filter(samples_meta.SAMPLEID == simpler_name).first()
    return jsonify(wfreq_data[0])

@app.route ("/samples/<sample>")
def samp_samps(sample):
    # print(sample)
    # SELECT BB_940 FROM 'samples' LIMIT 0,30
    print(db)
    print(dir(db.table('samples')))
    
    # print(db.table('samples').columns)
    resData = []
    with engine.connect() as con:

        rs = con.execute('SELECT otu_id, {0} FROM samples ORDER BY {0} DESC'.format(sample))

        for row in rs:
            print(row.values())
            resData.append(row.values())
    # t = text("SELECT {0} FROM 'samples'".format(sample))
	# result = db.execute(t)
    # print(result)
	# return jsonfy(result) 


    # print(samples['{0}'.format(sample)])

    # data=db.session.query().filter(samples_meta.SAMPLEID == simpler_name).first()
    # print(samples.__dir__)
    # find_data=session.query(samples.BB_940).all()
    # find_data=session.query(samples).filter(samples.in_([sample])).all()
    # tons_o_data = []
    #sample_values=db.session.query(samples.)
    #otu_ids=db.session.query(samples.WFREQ).filter(samples_meta.SAMPLEID == simpler_name).first()
    return jsonify(resData)



if __name__ == "__main__":
    app.run()

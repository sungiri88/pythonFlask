from flask import Flask,render_template,request,jsonify
import requests,json
app = Flask(__name__)

# Variables
artifactoryUrl='http://artifactory.in/artifactory/api' 
username="username"
password="password" 

# Common Functions
def getRequest(url,username,password):
    return requests.get(url,auth=(username,password), verify=False)

def postRequest(url,payload,username,password):
    return requests.post(url,data=payload, auth=(username,password), verify=False)

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/api/listDockerRepo/<string:repoName>', methods=['GET'])
def listDockerRepo(repoName):
	try:    
		response=getRequest(artifactoryUrl+'/docker/'+repoName+'/v2/_catalog',username,password)	
		print response.text
		return json.dumps(response.text)
	except Exception, e:
		return(str(e)) 

@app.route('/api/search/aql', methods=['POST'])
def searchAql():
	try:		    
		data=request.data		
		response=postRequest(artifactoryUrl+'/search/aql',data,username,password)
		print(response.text)
		return jsonify(response.text)
	except Exception, e:
		return(str(e)) 		

if __name__ == "__main__":
    app.run(debug=True,host="10.223.251.165",port="4000")
